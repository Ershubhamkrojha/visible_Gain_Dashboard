// // controllers/photoSessionController.js
// import PhotoSessionSchema from '../models/PhotoSessionSchema'; // Adjust the import based on your file structure

// export const handlePhotoSessions = async (req, res,next) => {
//     try {
//         if (req.method === 'POST') {
//             // Create a new photo session
//             const { title, description } = req.body; // Get title and description from request body
//             const image = req.file.path; // Get image path from multer

//             const newPhotoSession = await PhotoSessionSchema.create({
//                 title,
//                 description,
//                 image,
//             });

//             return res.status(201).json({
//                 success: true,
//                 message: 'Photo session created successfully',
//                 data: newPhotoSession,
//             });
//         } else if (req.method === 'GET') {
//             // Retrieve all photo sessions
//             const photoSessions = await PhotoSessionSchema.findAll();

//             return res.status(200).json({
//                 success: true,
//                 data: photoSessions,
//             });
//         } else {
//             // Method Not Allowed
//             return res.status(405).json({
//                 success: false,
//                 message: 'Method Not Allowed',
//             });
//         }
//     } catch (error) {
//         console.error('Error handling photo sessions:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to process request',
//             error: error.message,
//         });
//     }
// };
// controllers/photoSessionController.js
import PhotoSessionSchema from '../models/PhotoSessionSchema.js'; // Adjust the path based on your project structure

// Create a new photo session

export const createPhotoSession = async (req, res, next) => {
  try {
      const { title, description } = req.body;
      const imagePath = `/images/${req.file.filename}`; // Store relative URL path

      const newPhotoSession = await PhotoSessionSchema.create({
          title,
          description,
          image: imagePath, // Save URL path in database
      });

      res.status(201).json({
          message: 'Photo session uploaded successfully!',
          data: newPhotoSession,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// Get all photo sessions
export const getPhotoSessions = async (req, res,next) => {
    try {
        const sessions = await PhotoSessionSchema.findAll();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single photo session by ID
export const getPhotoSessionById = async (req, res,next) => {
    try {
        const session = await PhotoSessionSchema.findByPk(req.params.id);
        if (!session) return res.status(404).json({ message: "Session not found" });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a photo session by ID
export const updatePhotoSession = async (req, res,next) => {
    const { title, description } = req.body; // Ensure 'image' is included
    const sessionId = req.params.id;
    
    // Create a path for the new image if it exists
    const imagePath = req.file ? `/images/${req.file.filename}` : undefined;

    // Validate the required fields
    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
    }

    try {
        // Fetch the existing session
        const session = await PhotoSessionSchema.findByPk(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });

        // Prepare the update data object
        const updatedData = {
            title,
            description,
            ...(imagePath && { image: imagePath }) // Only include image if it exists
        };

        // Update the session
        await session.update(updatedData);

        // Optionally fetch the updated session for response
        const updatedSession = await PhotoSessionSchema.findByPk(sessionId);

        res.status(200).json(updatedSession);
    } catch (error) {
        console.error('Error updating photo session:', error);
        res.status(500).json({ message: error.message });
    }
};



// Delete a photo session by ID
export const deletePhotoSession = async (req, res,next) => {
    try {
        const session = await PhotoSessionSchema.findByPk(req.params.id);
        if (!session) return res.status(404).json({ message: "Session not found" });

        await session.destroy();
        res.status(204).send(); // No content response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
