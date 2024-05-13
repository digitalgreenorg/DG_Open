// const fs = require("fs");
// const path = require("path");

// const directoryPath = path.join(__dirname, "src/features/vistaar/src/Views");

// fs.readdir(directoryPath, (err, files) => {
//   if (err) {
//     return console.error("Error reading directory:", err);
//   }

//   files.forEach((file) => {
//     if (file.endsWith(".jsx") || file.endsWith(".js")) {
//       const filePath = path.join(directoryPath, file);

//       fs.readFile(filePath, "utf8", (err, data) => {
//         if (err) {
//           return console.error(`Error reading file ${file}:`, err);
//         }

//         let updatedData = data;
//         let matchCount = 0; // Count the number of matches found in the file
//         let importsAdded = {}; // To keep track of added imports

//         // Regular expression to find all image src with require
//         const regex =
//           /<img\s+([^>]*)src={require\(["'](.+?)["']\)}([^>]*)\/?>/g;

//         let match;
//         while ((match = regex.exec(data)) !== null) {
//           const [fullMatch, beforeSrc, imagePath, afterSrc] = match;
//           const imageName = path.basename(imagePath);

//           // Check if import statement already exists
//           if (!importsAdded[imageName]) {
//             const importStatement = `import ${imageName.replace(
//               /\..+$/,
//               ""
//             )} from '${imagePath}';\n`;

//             // Add import statement at the top
//             updatedData = importStatement + updatedData;
//             importsAdded[imageName] = true; // Mark import as added
//           }

//           // Replace img tag with the correct src, retaining all other attributes
//           updatedData = updatedData.replace(
//             fullMatch,
//             `<img ${beforeSrc} src={${imageName.replace(
//               /\..+$/,
//               ""
//             )}} ${afterSrc}>`
//           );

//           matchCount++;
//         }

//         if (matchCount > 0) {
//           // Only write the file if there were matches found
//           fs.writeFile(filePath, updatedData, "utf8", (err) => {
//             if (err) {
//               return console.error(`Error writing file ${file}:`, err);
//             }
//             console.log(`Updated ${file}`);
//           });
//         } else {
//           console.log(`No updates needed for ${file}`);
//         }
//       });
//     }
//   });
// });

// for image

// const fs = require("fs");
// const path = require("path");

// const directoryPath = path.join(__dirname, "src/features/kadp/src");

// // Function to recursively read all files in a directory and its subdirectories
// const readFilesRecursively = (dir, fileCallback) => {
//   fs.readdirSync(dir).forEach((file) => {
//     const filePath = path.join(dir, file);
//     if (fs.statSync(filePath).isDirectory()) {
//       readFilesRecursively(filePath, fileCallback);
//     } else {
//       fileCallback(filePath);
//     }
//   });
// };

// readFilesRecursively(directoryPath, (filePath) => {
//   if (filePath.endsWith(".jsx") || filePath.endsWith(".js")) {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) {
//         return console.error(`Error reading file ${filePath}:`, err);
//       }

//       let updatedData = data;
//       let matchCount = 0; // Count the number of matches found in the file
//       let importsAdded = {}; // To keep track of added imports

//       // Regular expression to find all image src with require
//       const regex = /<img\s+([^>]*)src={require\(["'](.+?)["']\)}([^>]*)\/?>/g;

//       let match;
//       while ((match = regex.exec(data)) !== null) {
//         const [fullMatch, beforeSrc, imagePath, afterSrc] = match;
//         const imageName = path.basename(imagePath);

//         // Check if import statement already exists
//         if (!importsAdded[imageName]) {
//           const importStatement = `import ${imageName.replace(
//             /\..+$/,
//             ""
//           )} from '${imagePath}';\n`;

//           // Add import statement at the top
//           updatedData = importStatement + updatedData;
//           importsAdded[imageName] = true; // Mark import as added
//         }

//         // Replace img tag with the correct src, retaining only style and alt attributes
//         updatedData = updatedData.replace(
//           fullMatch,
//           `<img ${beforeSrc} src={${imageName.replace(
//             /\..+$/,
//             ""
//           )}} ${afterSrc}>`
//         );

//         matchCount++;
//       }

//       if (matchCount > 0) {
//         // Only write the file if there were matches found
//         fs.writeFile(filePath, updatedData, "utf8", (err) => {
//           if (err) {
//             return console.error(`Error writing file ${filePath}:`, err);
//           }
//           console.log(`Updated ${filePath}`);
//         });
//       } else {
//         console.log(`No updates needed for ${filePath}`);
//       }
//     });
//   }
// });

// for context path update

// const fs = require("fs");
// const path = require("path");

// const directoryPath = path.join(__dirname, "src/features/vistaar/src");

// // Function to recursively read all files in a directory and its subdirectories
// const readFilesRecursively = (dir, fileCallback) => {
//   fs.readdirSync(dir).forEach((file) => {
//     const filePath = path.join(dir, file);
//     if (fs.statSync(filePath).isDirectory()) {
//       readFilesRecursively(filePath, fileCallback);
//     } else {
//       fileCallback(filePath);
//     }
//   });
// };

// readFilesRecursively(directoryPath, (filePath) => {
//   if (filePath.endsWith(".jsx") || filePath.endsWith(".js")) {
//     fs.readFile(filePath, "utf8", (err, data) => {
//       if (err) {
//         return console.error(`Error reading file ${filePath}:`, err);
//       }

//       let updatedData = data;
//       let matchCount = 0; // Count the number of matches found in the file

//       // Define patterns to replace and their replacement
//       const replacementMap = {
//         "../Contexts/FarmStackContext":
//           "common/components/context/VistaarContext/FarmStackProvider",
//         "../../Contexts/FarmStackContext":
//           "common/components/context/VistaarContext/FarmStackProvider",
//         "../../../Contexts/FarmStackContext":
//           "common/components/context/VistaarContext/FarmStackProvider",
//         "../../../../Contexts/FarmStackContext":
//           "common/components/context/VistaarContext/FarmStackProvider",
//       };

//       // Perform replacements
//       Object.keys(replacementMap).forEach((pattern) => {
//         const regex = new RegExp(pattern.replace(/\.\.\//g, "\\.{2}/"), "g"); // Escape dots for regex, then create regex
//         if (regex.test(updatedData)) {
//           updatedData = updatedData.replace(regex, replacementMap[pattern]);
//           matchCount++;
//         }
//       });

//       // Continue with your original file modification logic here if necessary...

//       if (matchCount > 0) {
//         // Only write the file if there were matches found
//         fs.writeFile(filePath, updatedData, "utf8", (err) => {
//           if (err) {
//             return console.error(`Error writing file ${filePath}:`, err);
//           }
//           console.log(`Updated ${filePath}`);
//         });
//       } else {
//         console.log(`No updates needed for ${filePath}`);
//       }
//     });
//   }
// });

const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "src/features/eadp/src");

// Function to recursively read all files in a directory and its subdirectories
const readFilesRecursively = (dir, fileCallback) => {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readFilesRecursively(filePath, fileCallback);
    } else {
      fileCallback(filePath);
    }
  });
};

readFilesRecursively(directoryPath, (filePath) => {
  if (filePath.endsWith(".jsx") || filePath.endsWith(".js")) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        return console.error(`Error reading file ${filePath}:`, err);
      }

      // Define the pattern for import statements to replace and their precise replacement
      const regex =
        /import\s+\{\s*FarmStackContext\s*\}\s+from\s+["']((?:\.\.\/)+)(?:[\w\/]+)?Contexts\/FarmStackContext["'];/g;

      // Replacement path
      const replacement = `import { FarmStackContext } from "common/components/context/EadpContext/FarmStackProvider";`;

      // Perform the replacement
      const updatedData = data.replace(regex, replacement);

      if (updatedData !== data) {
        // Only write the file if changes were made
        fs.writeFile(filePath, updatedData, "utf8", (err) => {
          if (err) {
            return console.error(`Error writing file ${filePath}:`, err);
          }
          console.log(`Updated ${filePath}`);
        });
      } else {
        console.log(`No updates needed for ${filePath}`);
      }
    });
  }
});
