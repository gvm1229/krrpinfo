const fs = require('fs');
const path = require('path');

const directoryToWatch = './src/components'; // Change this to the directory where your components are stored

function parseStoryContent(componentName, componentGroupName) {
  return `import React from 'react';
import ${componentName} from '@/src/components/${componentGroupName}/${componentName}';
import { ThemeProvider } from '@/src/components/DarkMode/theme-provider';
import { ModeToggle } from '@/src/components/DarkMode/theme-toggle';

export default {
  title: 'Components/${componentGroupName}/${componentName}',
  component: ${componentName},
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or \`padded\` by default
  },
};

const Template = (args) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <div className="container relative flex h-screen w-screen items-center justify-center">
      <div className="absolute right-0 top-10">
        <ModeToggle />
      </div>
      <${componentName} {...args} />
    </div>
  </ThemeProvider>
);

export const Default = Template.bind({});
Default.args = {
  // Define default props here
};
`;
}

// Function to recursively find all JSX files in a directory
function findJSXFiles(directory, filelist = []) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filepath = path.join(directory, file);
    if (fs.statSync(filepath).isDirectory())
      filelist = findJSXFiles(filepath, filelist);
    else
      if (file.endsWith('.jsx'))
        filelist.push(filepath);
  });
  return filelist;
}

// Find all JSX files in the directory and generate corresponding storybook files
const jsxFiles = findJSXFiles(directoryToWatch);
jsxFiles.forEach((jsxFile) => {
  const componentName = path.basename(jsxFile, '.jsx');
  const componentGroupName = path.relative(directoryToWatch, path.dirname(jsxFile)).replace(/\\/g, '/');
  const storyDirectoryPath = path.join('./src/stories', componentGroupName);
  const storyFilePath = path.join(storyDirectoryPath, `${componentName}.stories.jsx`);

  // Check if the story directory exists, if not, create it
  if (!fs.existsSync(storyDirectoryPath))
    fs.mkdirSync(storyDirectoryPath, { recursive: true });

  // Check if the story file already exists
  if (!fs.existsSync(storyFilePath)) {
    // If the story file doesn't exist, create it
    fs.writeFileSync(storyFilePath, parseStoryContent(componentName, componentGroupName), 'utf-8');
    console.log(`Created ${storyFilePath}`);
  }
});

console.log('Generated storybook files for existing components in', directoryToWatch);
