const readline = require('readline');
const { spawn } = require('child_process');

const commands = {
  1: 'npx react-native run-android --mode=stagingDebug --appId com.nutsales.light',
  2: 'npx react-native run-android --mode=productDebug --appId com.nutsales.app',
  3: 'npx react-native run-android --mode=stagingRelease --appId com.nutsales.light',
  4: 'npx react-native run-android --mode=productRelease --appId com.nutsales.app',
  5: 'cd android && ./gradlew assembleStagingRelease',
  6: 'cd android && ./gradlew assembleProductRelease',
  7: 'cd android && ./gradlew bundleStagingRelease',
  8: 'cd android && ./gradlew bundleProductRelease',
};

let currentChoice = 1;
const choices = [
  'Run android staging debug',
  'Run android product debug',
  'Run android staging release',
  'Run android product release',
  'Build android staging APK',
  'Build android product APK',
  'Build android staging bundle',
  'Build android product bundle',
];

function displayMenu() {
  console.clear();
  console.log('Choose a command to execute:');
  choices.forEach((choice, index) => {
    console.log(`${currentChoice === index + 1 ? '>' : ' '} ${index + 1}. ${choice}`);
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
    console.log('Invalid choice!');
    rl.close();
    return;
  }

  console.log(`Executing: ${command}`);

  const [cmd, ...args] = command.split(' ');
  const process = spawn(cmd, args, { shell: true });

  process.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  process.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  process.on('error', (error) => {
    console.error(`Error: ${error.message}`);
  });

  process.on('close', (code) => {
    console.log(`Process ended with code: ${code}`);
    rl.close();
  });
}

displayMenu();
