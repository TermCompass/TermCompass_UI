const { execSync } = require('child_process');
const depcheck = require('depcheck');

// depcheck 옵션 설정 (필요 시 수정)
const options = {
  ignoreDirs: ['node_modules', 'dist'],
  ignorePatterns: ['*.test.js'],
};

depcheck(process.cwd(), options, (unused) => {
  const missingDependencies = Object.keys(unused.missing);

  if (missingDependencies.length > 0) {
    console.log(`Missing dependencies found: ${missingDependencies.join(', ')}`);
    try {
      execSync(`npm install ${missingDependencies.join(' ')}`, { stdio: 'inherit' });
      console.log('Dependencies installed successfully.');
    } catch (error) {
      console.error('Failed to install some packages:', error);
    }
  } else {
    console.log('No missing dependencies found.');
  }
});
