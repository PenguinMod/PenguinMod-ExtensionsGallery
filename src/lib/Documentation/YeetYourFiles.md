# YeetYourFiles Extension Documentation

*"Upload files to the cloud by throwing it into outer space!"*

The YeetYourFiles extension allows you to upload files directly from your PenguinMod/TurboWarp projects to the YeetYourFiles hosting service. This extension provides blocks for uploading various types of files, tracking upload status, and retrieving file information.

## File Upload Blocks

### Upload File Data
```scratch
upload file data [data] name [file.txt] :: #FF8C00
```
Uploads file data with a specified filename to YeetYourFiles.

Parameters:
- **data**: The file content as a string, base64 encoded data, or data URL
- **name**: The filename to use for the uploaded file

Examples:
- Upload text: `upload file data [Hello World!] name [greeting.txt]`
- Upload base64 image: `upload file data [iVBORw0KGgoAAAANSUhEUg...] name [image.png]`
- Upload JSON data: `upload file data [{"name": "John", "age": 30}] name [data.json]`
- It can also upload data urls

### Upload File from URL
```scratch
upload file from URL [https://example.com/image.png] :: #FF8C00
```
Downloads a file from a URL and uploads it to YeetYourFiles.

Parameters:
- **URL**: The web address of the file to download and upload

Examples:
- Upload remote image: `upload file from URL [https://picsum.photos/200/300]`
- Upload remote document: `upload file from URL [https://example.com/document.pdf]`

### Open File Dialog
```scratch
open file dialog and upload :: #FF8C00
```
Opens a file picker dialog allowing users to select and upload files from their device.

This block:
- Opens the native file selection dialog
- Accepts any file type
- Automatically uploads the selected file
- Updates all file information blocks with the upload results

## File Information Blocks

### Last Uploaded File ID
```scratch
(last uploaded file ID :: #FF8C00)
```
Returns the unique identifier of the most recently uploaded file.

Examples:
- File ID: `3af5f431-b4a2-414a-8524-f878551e7c59`
- Can be used to reference the file in other operations

### Last Uploaded File URL
```scratch
(last uploaded file URL :: #FF8C00)
```
Returns the complete web address where the uploaded file can be accessed.

Examples:
- Full URL: `https://yyf.mubilop.com/file/abc123def456`
- Direct access link to view or download the file

### Last Uploaded File Short Hash
```scratch
(last uploaded file short hash :: #FF8C00)
```
Returns a the short hash used by the server on some routes.

Examples:
- Short hash: `abc123cd`

### Last Uploaded File Data
```scratch
(last uploaded file data :: #FF8C00)
```
Returns the complete upload response as a JSON string containing the response from the server (should be used for advanced stuff)

Example response:
```json
{
   "message":"File uploaded successfully",
   "fileId":"16fd17d4-0d36-4318-9452-f19cb3259374",
   "fileUrl":"/file/123456ab/MubiIsCool.mov",
   "shortHash":"123456ab"
}
```

## Status and Monitoring Blocks

### Upload Status
```scratch
(upload status :: #FF8C00)
```
Returns the current status of file uploads.

Possible values:
- `idle`: No upload in progress
- `uploading`: File upload is currently in progress

### Upload Successful?
```scratch
<upload successful? :: #FF8C00>
```
Returns true if the last upload operation completed successfully, false otherwise.

Examples:
- `true`: Last upload completed without errors
- `false`: Last upload failed or encountered an error

### Uploaded?
```scratch
<uploaded? :: #FF8C00>
```
Returns true if any file has been uploaded during the current session, false otherwise.

Examples:
- `true`: At least one file has been uploaded since the project started
- `false`: No files have been uploaded yet

### Total Files on YeetYourFiles
```scratch
(total files on YeetYourFiles :: #FF8C00)
```
Returns the total number of files currently hosted on the YeetYourFiles service.

Examples:
- `15234`: Total files across all users
- Updates each time the block is used

## Usage Examples

### Basic Text Upload
```scratch
when flag clicked
upload file data [Hello from Scratch!] name [message.txt]
wait until <upload successful?>
say (join [File uploaded: ] (last uploaded file URL)) for (2) seconds
```

### Upload with Status Monitoring
```scratch
when flag clicked
upload file data [{"score": 100, "level": 5}] name [game-data.json]
repeat until <not (upload status) = [uploading]>
  say [Uploading...] for (0.1) seconds
end
if <upload successful?> then
  say [Upload complete!] for (2) seconds
else
  say [Upload failed!] for (2) seconds
end
```

### Interactive File Upload
```scratch
when [space v] key pressed
open file dialog and upload
wait until <uploaded?>
if <upload successful?> then
  set [file count v] to (total files on YeetYourFiles)
  say (join [Uploaded! Total files: ] (file count)) for (2) seconds
end
```

## Error Handling

(You can use PenguinMod's Try and Catch block with it!)

The extension includes built-in error handling for common issues:

- **No file data**: Returns error when trying to upload empty data
- **Invalid URL**: Returns error for malformed or inaccessible URLs  
- **Network issues**: Handles connection failures gracefully
- **Server errors**: Provides feedback for server-side upload issues

When an upload fails:
- The `upload successful?` block returns false
- The `upload status` returns to "idle"
- Error information is stored in the upload data for debugging

## Service Information

**YeetYourFiles Service**: https://yyf.mubilop.com
- Free file hosting service
- No registration required
- Supports files up to reasonable size limits
- Files are publicly accessible via direct URLs

## Additional Notes

- The extension requires unsandboxed mode to function properly
- File uploads are performed asynchronously
- All uploaded files become publicly accessible via their URLs
- The service maintains a global counter of total uploaded files
- File metadata is preserved including original filenames and upload timestamps
