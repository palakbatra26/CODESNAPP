export const generateImage = async (req, res) => {
    const { prompt, aspectRatio, style, negativePrompt, model, customSeed, upscale } = req.body;
    if (!prompt || prompt.trim() === '') {
        return res.status(400).json({ message: 'Prompt cannot be empty' });
    }

    try {
        // [Feature 2] Custom Seed Injection
        const seed = customSeed ? parseInt(customSeed) : Math.floor(Math.random() * 1000000);
        
        let finalPrompt = prompt;
        if (style && style !== 'none') {
            finalPrompt = `${prompt}, in the style of ${style}, 8k resolution, masterpiece, highly detailed`;
        }
        const encodedPrompt = encodeURIComponent(finalPrompt);
        
        let width = 1024;
        let height = 1024;
        if (aspectRatio === '16:9') {
            width = 1280;
            height = 720;
        } else if (aspectRatio === '9:16') {
            width = 720;
            height = 1280;
        }

        // [Feature 3] HD Upscaling Engine
        if (upscale) {
            width = Math.floor(width * 1.5);
            height = Math.floor(height * 1.5);
        }

        let pollUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=${width}&height=${height}`;
        
        if (model) {
            pollUrl += `&model=${model}`;
        }
        if (negativePrompt && negativePrompt.trim() !== '') {
            pollUrl += `&negative_prompt=${encodeURIComponent(negativePrompt)}`;
        }

        // 5. Backend Fetcher to bypass UI IP queue limits
        const response = await fetch(pollUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`AI API failed (${response.status}). Please wait 10 seconds and try again.`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        
        const image = await Image.create({
            userId: req.user._id,
            prompt,
            imageUrl: base64Image
        });

        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserHistory = async (req, res) => {
    try {
        const images = await Image.find({ 
            userId: req.user._id,
            imageUrl: { $regex: '^data:image/' } 
        }).sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllHistory = async (req, res) => {
    try {
        const images = await Image.find({
            imageUrl: { $regex: '^data:image/' } 
        }).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const storeRandomImages = async (req, res) => {
    try {
        // High quality external image placeholders to skip the Generation backend wait time!
        const randomData = [
            { userId: req.user._id, prompt: "A cyberpunk neon samurai sitting in rain, ultra detailed, 8k resolution, cinematic lighting", imageUrl: "https://images.unsplash.com/photo-1533038590840-1cbea6d6d376?q=80&w=1000&auto=format&fit=crop" },
            { userId: req.user._id, prompt: "Majestic fantasy landscape with floating crystal castle, ethereal gorgeous rays, masterpiece", imageUrl: "https://images.unsplash.com/photo-1618331835717-8149e1e24bc1?q=80&w=1000&auto=format&fit=crop" },
            { userId: req.user._id, prompt: "Minimalist geometric 3D render art of a black hole, octane render, vivid colors", imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop" },
            { userId: req.user._id, prompt: "Sleek majestic sports car drifting in a digital grid environment, Synthwave style", imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop" }
        ];
        await Image.insertMany(randomData);
        res.json({ message: 'Success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        // Ensure user owns the image or is an admin
        if (image.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized to delete this image' });
        }

        await Image.deleteOne({ _id: image._id });
        res.json({ message: 'Image removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
