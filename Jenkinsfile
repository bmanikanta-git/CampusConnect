pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out CampusConnect project...'
            }
        }

        stage('Validate Files') {
            steps {
                bat '''
                echo Checking CampusConnect files...

                if not exist index.html exit /b 1
                if not exist events.html exit /b 1
                if not exist dashboard.html exit /b 1

                if not exist css\\style.css exit /b 1
                if not exist css\\dashboard.css exit /b 1

                if not exist js\\events.js exit /b 1
                if not exist js\\dashboard.js exit /b 1

                echo All required files found.
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'CampusConnect build successful!'
            }
        }
    }

    post {

        success {
            echo 'CI Pipeline completed successfully.'
        }

        failure {
            echo 'CI Pipeline failed.'
        }
    }
}