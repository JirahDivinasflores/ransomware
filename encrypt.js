var encryptor = require('file-encryptor');
var fs = require('fs');
var path = require('path');

var key = 'jai';
var folderPath = 'Sample';

// Get a list of all files in the specified folder
fs.readdir(folderPath, function(err, files) {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  // Iterate through each file in the folder
  files.forEach(function(file) {
    var filePath = path.join(folderPath, file);
    var encryptedFilePath = path.join(folderPath, 'encrypted_' + file);

    // Encrypt file.
    encryptor.encryptFile(filePath, encryptedFilePath, key, function(err) {
      if (err) {
        console.error('Encryption error for file', file, ':', err);
      } else {
        console.log('Encryption complete for file', file);

        // Delete the original file after encrypting
        fs.unlink(filePath, function(err) {
          if (err) {
            console.error('Error deleting original file', file, ':', err);
          } else {
            console.log('Original file', file, 'deleted.');
          }
        });
      }
    });
  });
});
