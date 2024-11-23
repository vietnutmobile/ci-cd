const readline = require('readline');
const {spawn} = require('child_process');

const COMMANDS = {
  STAGING_DEBUG: {
    id: 1,
    title: 'Run android staging debug',
    command:
      'cp .env.staging .env && npx react-native run-android --mode=stagingDebug --appId com.nutsales.light',
  },
  PRODUCT_DEBUG: {
    id: 2,
    title: 'Run android product debug',
    command:
      'cp .env.production .env && npx react-native run-android --mode=productDebug --appId com.nutsales.app',
  },
  STAGING_RELEASE: {
    id: 3,
    title: 'Run android staging release',
    command:
      'cp .env.staging .env && npx react-native run-android --mode=stagingRelease --appId com.nutsales.light',
  },
  PRODUCT_RELEASE: {
    id: 4,
    title: 'Run android product release',
    command:
      'cp .env.production .env && cd android && ./gradlew assembleProductRelease',
  },
  BUILD_STAGING_APK: {
    id: 5,
    title: 'Build android staging APK',
    command:
      'cp .env.staging .env && cd android && ./gradlew assembleStagingRelease',
  },
  BUILD_PRODUCT_APK: {
    id: 6,
    title: 'Build android product APK',
    command:
      'cp .env.production .env && cd android && ./gradlew assembleProductRelease',
  },
  BUILD_STAGING_BUNDLE: {
    id: 7,
    title: 'Build android staging bundle',
    command:
      'cp .env.staging .env && cd android && ./gradlew bundleStagingRelease',
  },
  BUILD_PRODUCT_BUNDLE: {
    id: 8,
    title: 'Build android product bundle',
    command:
      'cp .env.production .env && cd android && ./gradlew bundleProductRelease',
  },
  CLEAN: {
    id: 9,
    title: 'Clean android project',
    command:
      'cd android && ORG_GRADLE_PROJECT_newArchEnabled=false ./gradlew clean&&cd ..',
  },
};

const commands = Object.fromEntries(
  Object.values(COMMANDS).map(({id, command}) => [id, command]),
);

const choices = Object.values(COMMANDS).map(({title}) => title);

let currentChoice = 1;

function displayMenu() {
  console.clear();
  console.log('Choose a command to execute:');
  choices.forEach((choice, index) => {
    console.log(
      `${currentChoice === index + 1 ? '>' : ' '} ${index + 1}. ${choice}`,
    );
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'c' && key.ctrl) {
    process.exit();
  } else if (key.name === 'up') {
    currentChoice = currentChoice > 1 ? currentChoice - 1 : choices.length;
    displayMenu();
  } else if (key.name === 'down') {
    currentChoice = currentChoice < choices.length ? currentChoice + 1 : 1;
    displayMenu();
  } else if (key.name === 'return') {
    process.stdin.setRawMode(false);
    process.stdin.removeAllListeners('keypress');
    executeCommand(currentChoice);
  }
});

function executeCommand(answer) {
  const command = commands[answer];

  if (!command) {
    console.error('Invalid choice!');
    rl.close();
    return;
  }

  console.log('\nExecuting command...');
  console.log(command);

  const process = spawn(command, [], {
    shell: true,
    stdio: 'inherit',
  });

  process.on('error', error => {
    console.error('\nError occurred:', error.message);
    rl.close();
  });

  process.on('close', code => {
    console.log('\nProcess completed with exit code:', code);
    if (code !== 0) {
      console.error('Command failed to execute successfully');
    }
    rl.close();
  });
}

displayMenu();
