
import unittest
import uuid
import subprocess
import time
import urllib.request
import urllib.error

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC


BASE_URL = "http://localhost:8090"
STORAGE_KEY = "campusConnectRegistrations"


class CampusConnectTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        options = Options()
        options.binary_location = (
            r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        )

        cls.driver = webdriver.Chrome(options=options)
        cls.driver.maximize_window()
        cls.driver.set_page_load_timeout(20)

        cls.wait = WebDriverWait(cls.driver, 10)

        cls.driver.execute_cdp_cmd("Network.enable", {})
        cls.driver.execute_cdp_cmd(
            "Network.setCacheDisabled",
            {"cacheDisabled": True}
        )

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def check_page(self, path):
        self.driver.get(BASE_URL + path)

        self.wait.until(
            lambda driver: driver.execute_script(
                "return document.readyState"
            ) == "complete"
        )

        body_text = self.driver.find_element(
            By.TAG_NAME, "body"
        ).text

        self.assertTrue(
            body_text.strip(),
            f"Page {path} loaded without visible content"
        )

        print(f"PASS: {path} loaded successfully")

    def register_student(self, name, email, roll, event_name):
        driver = self.driver

        driver.get(BASE_URL + "/register/")

        driver.find_element(
            By.ID, "studentName"
        ).send_keys(name)

        driver.find_element(
            By.ID, "studentEmail"
        ).send_keys(email)

        driver.find_element(
            By.ID, "rollNumber"
        ).send_keys(roll)

        Select(
            driver.find_element(By.ID, "eventSelect")
        ).select_by_visible_text(event_name)

        driver.find_element(
            By.CSS_SELECTOR,
            "#registrationForm button[type='submit']"
        ).click()

        return self.wait.until(
            lambda d: d.find_element(
                By.ID, "registrationMessage"
            ).text.strip()
        )

    def cleanup_test_registration(self, email):
        self.driver.get(BASE_URL + "/register/")

        self.driver.execute_script("""
            const key = arguments[0];
            const email = arguments[1].toLowerCase();

            const records = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            localStorage.setItem(
                key,
                JSON.stringify(
                    records.filter(
                        item =>
                            String(item.studentEmail || "").toLowerCase()
                            !== email
                    )
                )
            );
        """, STORAGE_KEY, email)

    # TEST 01: Home page
    def test_01_home_page(self):
        self.check_page("/")

    # TEST 02: Events page
    def test_02_events_page(self):
        self.check_page("/events/")

    # TEST 03: Registration page
    def test_03_registration_page(self):
        self.check_page("/register/")

    # TEST 04: Dashboard page
    def test_04_dashboard_page(self):
        self.check_page("/dashboard/")

    # TEST 05: Student registration and Dashboard verification
    def test_05_student_registration(self):

        driver = self.driver

        student_name = "Selenium Test Student"
        student_email = (
            f"selenium_{uuid.uuid4().hex[:8]}@test.com"
        )
        roll_number = "TEST2026"

        message = self.register_student(
            student_name,
            student_email,
            roll_number,
            "CodeSprint 2026"
        )

        self.assertEqual(
            message,
            "Registration successful!"
        )

        print("PASS: Registration submitted")
        print("Registration message:", message)

        driver.get(BASE_URL + "/dashboard/")

        self.wait.until(
            EC.presence_of_element_located(
                (By.ID, "registeredEvents")
            )
        )

        dashboard_text = driver.find_element(
            By.TAG_NAME, "body"
        ).text

        self.assertIn(student_name, dashboard_text)
        self.assertIn(student_email, dashboard_text)

        print("PASS: Registration visible in Dashboard")

    # TEST 06: Docker failure, isolation and recovery
    def test_06_docker_failure_and_recovery(self):

        driver = self.driver

        print("\nStopping Events container...")

        subprocess.run(
            ["docker", "compose", "stop", "events"],
            check=True,
            capture_output=True,
            text=True
        )

        try:
            status = subprocess.run(
                ["docker", "compose", "ps", "-a", "events"],
                capture_output=True,
                text=True,
                check=True
            )

            print("Events container status:")
            print(status.stdout)

            # Check gateway response without waiting for
            # Chrome's full page-load timeout.
            request = urllib.request.Request(
                BASE_URL + "/events/?test=" + str(time.time()),
                headers={"Cache-Control": "no-cache"}
            )

            try:
                with urllib.request.urlopen(
                    request, timeout=15
                ) as response:
                    status_code = response.status

            except urllib.error.HTTPError as error:
                status_code = error.code

            print("Gateway response:", status_code)

            self.assertIn(
                status_code,
                (502, 504),
                f"Expected 502 or 504, received {status_code}"
            )

            print("PASS: Events service is unavailable")

            self.check_page("/")
            self.check_page("/register/")
            self.check_page("/dashboard/")

            print("PASS: Other services remain available")

        finally:
            print("Restarting Events container...")

            subprocess.run(
                ["docker", "compose", "start", "events"],
                check=True,
                capture_output=True,
                text=True
            )

        recovered = False

        for attempt in range(15):
            driver.get(
                BASE_URL + "/events/?recovery=" + str(time.time())
            )

            body_text = driver.find_element(
                By.TAG_NAME, "body"
            ).text

            if (
                "502 Bad Gateway" not in body_text
                and "504 Gateway Time-out" not in body_text
                and "Campus Events" in body_text
            ):
                recovered = True
                break

            time.sleep(1)

        self.assertTrue(
            recovered,
            "Events service did not recover"
        )

        print("PASS: Events service recovered successfully")

    # TEST 07: Event search
    def test_07_event_search(self):

        driver = self.driver
        driver.get(BASE_URL + "/events/")

        search = driver.find_element(
            By.ID, "searchInput"
        )

        search.send_keys("CodeSprint 2026")

        self.wait.until(
            lambda d: len([
                card for card in d.find_elements(
                    By.CSS_SELECTOR, ".event-card"
                ) if card.is_displayed()
            ]) == 1
        )

        visible_cards = [
            card for card in driver.find_elements(
                By.CSS_SELECTOR, ".event-card"
            ) if card.is_displayed()
        ]

        self.assertIn(
            "CodeSprint 2026",
            visible_cards[0].text
        )

        print("PASS: Event search works")

    # TEST 08: Event category filtering
    def test_08_event_category_filter(self):

        driver = self.driver
        driver.get(BASE_URL + "/events/")

        technical_button = driver.find_element(
            By.CSS_SELECTOR,
            ".filter-btn[data-category='Technical']"
        )

        technical_button.click()

        self.wait.until(
            lambda d: len([
                card for card in d.find_elements(
                    By.CSS_SELECTOR, ".event-card"
                ) if card.is_displayed()
            ]) == 2
        )

        visible_cards = [
            card for card in driver.find_elements(
                By.CSS_SELECTOR, ".event-card"
            ) if card.is_displayed()
        ]

        self.assertEqual(len(visible_cards), 2)

        for card in visible_cards:
            self.assertEqual(
                card.get_attribute("data-category"),
                "Technical"
            )

        print("PASS: Technical category filtering works")

    # TEST 09: Registration validation
    def test_09_registration_validation(self):

        driver = self.driver
        driver.get(BASE_URL + "/register/")

        driver.find_element(
            By.ID, "studentName"
        ).send_keys("John123")

        driver.find_element(
            By.ID, "studentEmail"
        ).send_keys("validation@test.com")

        driver.find_element(
            By.ID, "rollNumber"
        ).send_keys("TEST2026")

        Select(
            driver.find_element(By.ID, "eventSelect")
        ).select_by_visible_text("CodeSprint 2026")

        driver.find_element(
            By.CSS_SELECTOR,
            "#registrationForm button[type='submit']"
        ).click()

        message = self.wait.until(
            lambda d: d.find_element(
                By.ID, "registrationMessage"
            ).text.strip()
        )

        self.assertIn(
            "valid name",
            message.lower()
        )

        print("PASS: Invalid student name rejected")

    # TEST 10: Duplicate registration prevention
    def test_10_duplicate_registration(self):

        email = f"duplicate_{uuid.uuid4().hex[:8]}@test.com"

        try:
            first_message = self.register_student(
                "Duplicate Test Student",
                email,
                "TEST2026",
                "CodeSprint 2026"
            )

            self.assertEqual(
                first_message,
                "Registration successful!"
            )

            second_message = self.register_student(
                "Duplicate Test Student",
                email,
                "TEST2026",
                "CodeSprint 2026"
            )

            self.assertIn(
                "already registered",
                second_message
            )

            print("PASS: Duplicate registration prevented")

        finally:
            self.cleanup_test_registration(email)

    # TEST 11: Dashboard statistics
    def test_11_dashboard_statistics(self):

        driver = self.driver
        driver.get(BASE_URL + "/dashboard/")

        registrations = driver.execute_script("""
            return JSON.parse(
                localStorage.getItem(arguments[0]) || "[]"
            );
        """, STORAGE_KEY)

        expected_total = len(registrations)

        expected_events = len(set(
            item.get("eventName")
            for item in registrations
        ))

        expected_students = len(set(
            str(item.get("studentEmail", "")).lower()
            for item in registrations
        ))

        actual_total = int(
            driver.find_element(
                By.ID, "totalRegistrations"
            ).text
        )

        actual_events = int(
            driver.find_element(
                By.ID, "uniqueEvents"
            ).text
        )

        actual_students = int(
            driver.find_element(
                By.ID, "studentCount"
            ).text
        )

        self.assertEqual(actual_total, expected_total)
        self.assertEqual(actual_events, expected_events)
        self.assertEqual(actual_students, expected_students)

        print("PASS: Dashboard statistics are accurate")

    # TEST 12: Dashboard unregister functionality
    def test_12_dashboard_unregister(self):

        driver = self.driver

        email = f"unregister_{uuid.uuid4().hex[:8]}@test.com"

        message = self.register_student(
            "Unregister Test Student",
            email,
            "TEST2026",
            "CodeSprint 2026"
        )

        self.assertEqual(
            message,
            "Registration successful!"
        )

        try:
            driver.get(BASE_URL + "/dashboard/")

            self.wait.until(
                lambda d: email in d.find_element(
                    By.TAG_NAME, "body"
                ).text
            )

            cards = driver.find_elements(
                By.CSS_SELECTOR, ".registered-card"
            )

            target_card = next(
                card for card in cards
                if email in card.text
            )

            target_card.find_element(
                By.CSS_SELECTOR,
                "button.unregister-btn"
            ).click()

            self.wait.until(
                lambda d: email not in d.find_element(
                    By.TAG_NAME, "body"
                ).text
            )

            updated_total = int(
                driver.find_element(
                    By.ID, "totalRegistrations"
                ).text
            )

            registrations = driver.execute_script("""
                return JSON.parse(
                    localStorage.getItem(arguments[0]) || "[]"
                );
            """, STORAGE_KEY)

            self.assertEqual(
                updated_total,
                len(registrations)
            )

            self.assertFalse(
                any(
                    item.get("studentEmail") == email
                    for item in registrations
                )
            )

            print(
                "PASS: Unregister removes student and updates statistics"
            )

        finally:
            self.cleanup_test_registration(email)


if __name__ == "__main__":
    unittest.main(verbosity=2)
