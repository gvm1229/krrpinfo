// noinspection JSLastCommaInObjectLiteral
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const directoryToWatch = './src/components'; // Change this to the directory where your components are stored

function parseStoryContent(
  componentName,
  componentGroupName,
  componentExtension,
) {
  if (componentExtension === '.tsx')
    return `import React from 'react';
import ${componentName} from '@/components/${componentGroupName}/${componentName}';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';
import type { Meta, StoryObj } from '@storybook/react';

export default {
  title: 'Components/${componentGroupName}/${componentName}',
  component: ${componentName},
  argTypes: {
    // Define default argTypes here
  },
  parameters: {
    layout: 'fullscreen', // or \`padded\` by default
  },
} as Meta<typeof ${componentName}>;

type ${componentName}Props = React.ComponentProps<typeof ${componentName}>;

export const Default: StoryObj<${componentName}> = (args: ${componentName}Props) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
  >
    <div className="container relative flex h-screen w-screen items-center justify-center">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <${componentName} {...args} />
    </div>
  </ThemeProvider>
);
Default.args = {
  // Define default props here
};
`;

  return `import React from 'react';
import ${componentName} from '@/components/${componentGroupName}/${componentName}';
import { ThemeProvider } from '@/components/DarkMode/theme-provider';
import { ModeToggle } from '@/components/DarkMode/theme-toggle';

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
      <div className="absolute right-4 top-4">
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

// Function to recursively find all files with specified extensions in a directory
function findFilesByExtensions(directory, extensions, filelist = []) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    const filepath = path.join(directory, file);
    if (fs.statSync(filepath).isDirectory())
      filelist = findFilesByExtensions(filepath, extensions, filelist);
    else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) filelist.push(filepath);
    }
  });
  return filelist;
}

// Generate stories for specified directory or all components
function generateStories(componentDirectory) {
  const componentFiles = findFilesByExtensions(componentDirectory, [
    '.jsx',
    '.tsx',
  ]);
  componentFiles.forEach((componentFile) => {
    const componentName = path.basename(
      componentFile,
      path.extname(componentFile),
    );
    const componentGroupName = path
      .relative(directoryToWatch, path.dirname(componentFile))
      .replace(/\\/g, '/');
    const storyDirectoryPath = path.join('./src/stories', componentGroupName);
    const storyFilePath = path.join(
      storyDirectoryPath,
      `${componentName}.stories${path.extname(componentFile)}`,
    );

    // Check if the story directory exists, if not, create it
    if (!fs.existsSync(storyDirectoryPath))
      fs.mkdirSync(storyDirectoryPath, { recursive: true });

    // Check if the story file already exists
    if (!fs.existsSync(storyFilePath)) {
      // If the story file doesn't exist, create it
      fs.writeFileSync(
        storyFilePath,
        parseStoryContent(
          componentName,
          componentGroupName,
          path.extname(componentFile),
        ),
        'utf-8',
      );
      console.log(`Created ${storyFilePath}`);
    }
  });
}

// Prompt user for input
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  `Would you like to generate stories for all components or specify a directory name?
1. Press "a" for all components.
2. Enter the directory name for a specific directory.
> `,
  (answer) => {
    if (answer === 'a') {
      generateStories(directoryToWatch);
      readline.close();
    } else {
      const componentDirectory = path.join(directoryToWatch, answer);
      if (!fs.existsSync(componentDirectory)) {
        console.log(`Invalid directory: ${componentDirectory}`);
        readline.question(
          'Would you like to try again (enter "y" for yes or "n" for no)? ',
          (retryAnswer) => {
            if (retryAnswer.toLowerCase() === 'y') {
              readline.close();
              process.exit(1);
            } else {
              readline.close();
              process.exit(0);
            }
          },
        );
      } else {
        generateStories(componentDirectory);
        readline.close();
      }
    }
  },
);
