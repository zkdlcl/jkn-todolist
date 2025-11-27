// Notification test script
// This script will help verify if the react-toastify notifications are working properly

const fs = require('fs');
const path = require('path');

// Check if react-toastify is installed in client package.json
const clientPackageJsonPath = path.join(__dirname, 'client', 'package.json');

if (fs.existsSync(clientPackageJsonPath)) {
  const clientPackageJson = JSON.parse(fs.readFileSync(clientPackageJsonPath, 'utf8'));
  const dependencies = clientPackageJson.dependencies || {};
  
  if (dependencies['react-toastify']) {
    console.log('✅ react-toastify is installed in client package.json');
    console.log(`Version: ${dependencies['react-toastify']}`);
  } else {
    console.log('❌ react-toastify is NOT installed in client package.json');
  }
} else {
  console.log('❌ client/package.json does not exist');
}

// Check if the notification utility file exists and is properly implemented
const notificationPath = path.join(__dirname, 'client', 'src', 'utils', 'notification.js');

if (fs.existsSync(notificationPath)) {
  console.log('\n✅ Notification utility file exists');
  const notificationContent = fs.readFileSync(notificationPath, 'utf8');
  console.log('Content preview:');
  console.log(notificationContent.substring(0, 300) + '...');
} else {
  console.log('\n❌ Notification utility file does not exist');
}

// Check if ToastContainer is added to App.jsx
const appPath = path.join(__dirname, 'client', 'src', 'App.jsx');

if (fs.existsSync(appPath)) {
  console.log('\n✅ App.jsx exists');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  if (appContent.includes('ToastContainer')) {
    console.log('✅ ToastContainer is included in App.jsx');
  } else {
    console.log('❌ ToastContainer is NOT included in App.jsx');
  }
  
  if (appContent.includes('react-toastify')) {
    console.log('✅ react-toastify import is present in App.jsx');
  } else {
    console.log('❌ react-toastify import is NOT present in App.jsx');
  }
} else {
  console.log('\n❌ App.jsx does not exist');
}

// Check if notification functions are imported in the relevant files
const checkFileImports = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('notification')) {
      console.log(`✅ Notification imports found in ${description}`);
      if (content.match(/show(Info|Success|Error|Warning)/g)) {
        console.log(`✅ Notification calls found in ${description}:`, content.match(/show(Info|Success|Error|Warning)/g));
      }
    } else {
      console.log(`❌ No notification imports found in ${description}`);
    }
  } else {
    console.log(`❌ ${description} does not exist`);
  }
};

checkFileImports(path.join(__dirname, 'client', 'src', 'pages', 'HomePage.jsx'), 'HomePage.jsx');
checkFileImports(path.join(__dirname, 'client', 'src', 'components', 'TodoModal.jsx'), 'TodoModal.jsx');
checkFileImports(path.join(__dirname, 'client', 'src', 'pages', 'TrashPage.jsx'), 'TrashPage.jsx');