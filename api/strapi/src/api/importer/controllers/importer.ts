const fs = require('fs');
const xml2js = require('xml2js');
const { Transform } = require('stream');

module.exports = {
  index: async (ctx) => {
    try {
      // Check if the request has a file attached
      if (!ctx.request.files || !ctx.request.files.file) {
        ctx.response.status = 400;
        ctx.response.body = 'No XML file attached.';
        return;
      }

      // Get the uploaded file from the request
      const uploadedFile = ctx.request.files.file;

      // Create a new XML to JSON parser
      const parser = new xml2js.Parser({ explicitArray: false });

      // Variables to store JSON data and errors
      let jsonData = null;
      let error = null;

      // Handle XML to JSON parsing events
      parser.on('error', (err) => {
        error = err;
      });

      // Create a readable stream from the uploaded file path
      const fileStream = fs.createReadStream(uploadedFile.path);

      // Transform stream to parse XML data into JSON
      const xmlParser = new Transform({
        transform(chunk, encoding, callback) {
          parser.parseString(chunk, (err, data) => {
            if (err) {
              error = err;
            } else {
              jsonData = data;
            }
            callback();
          });
        },
      });

      // When the transformation is complete, send the response
      xmlParser.on('finish', () => {
        if (error) {
          console.error('Error parsing XML:', error);
          ctx.response.status = 500;
          ctx.response.body = 'Error parsing XML.';
        } else {
          // Return the JSON data as the response
          ctx.response.status = 200;
          ctx.response.body = jsonData;
        }
      });

      // Pipe the file stream to the XML parser and then to the response
      fileStream.pipe(xmlParser);
    } catch (err) {
      console.error('Error handling XML file:', err);
      ctx.response.status = 500;
      ctx.response.body = 'Error handling XML file.';
    }
  },
};
