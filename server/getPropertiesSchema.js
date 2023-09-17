const mongoose = require('mongoose');

function generateSchemaFromGeoJSON(geojsonData) {
    const properties = geojsonData[0].properties; // Assuming all elements have the same properties

    const schemaFields = {};

    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            const value = properties[key];
            let field = {};

            // Determine the Mongoose field type based on the property value type
            if (typeof value === 'string') {
                field = String;
            } else if (typeof value === 'number') {
                field = Number;
            } else if (typeof value === 'boolean') {
                field = Boolean;
            } else {
                field = String; // Fallback to String for other types
            }

            schemaFields[key] = field;
        }
    }

    const generatedSchema = new mongoose.Schema(schemaFields);
    return generatedSchema;
};

module.exports = generateSchemaFromGeoJSON;