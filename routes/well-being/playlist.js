const express = require('express')
const {queryAsync} = require('../../conn')
router = express.Router()

router.get('/', async(req, res) =>{
    try {
        const groups = await queryAsync('SELECT * FROM playlist');
        res.status(200).json(groups);

    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
})
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { playlist, player,description, link} = req.body;

        if (!playlist || !player || !description || !link) {
            return res.status(400).json({ message: "All fields required" });
        }

        const newPlaylist = {
            playlistName : playlist,
            musicPlayer : player,
            link : link,
            description : description,
            user_id : userId
        };

        await queryAsync('INSERT INTO playlist SET ?', newPlaylist);

        res.status(201).json({ message: "Playlist created successfully", task: newPlaylist });
    } catch (error) {
        console.error("Error from the playlist endpoint:", error);
        res.status(500).json({ error: "Internal server error", message : error });
    }
});


module.exports = router