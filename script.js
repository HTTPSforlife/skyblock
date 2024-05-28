async function fetchPlayerData() {
    const username = document.getElementById('username').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!username) {
        resultsDiv.innerHTML = 'Please enter a username.';
        return;
    }

    try {
        // Fetch UUID from Mojang API
        const uuidResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        if (!uuidResponse.ok) {
            throw new Error('Username not found.');
        }
        const uuidData = await uuidResponse.json();
        const uuid = uuidData.id;

        // Fetch SkyBlock profiles from Hypixel API
        const apiKey = '210dba0d-4d78-4fd0-b460-0beeb52807a4';
        const hypixelResponse = await fetch(`https://api.hypixel.net/skyblock/profiles?key=${apiKey}&uuid=${uuid}`);
        if (!hypixelResponse.ok) {
            throw new Error('Failed to fetch SkyBlock profiles.');
        }
        const hypixelData = await hypixelResponse.json();
        if (!hypixelData.success || !hypixelData.profiles) {
            throw new Error('Player not found on Hypixel.');
        }

        // Assuming the first profile is the one we want
        const profile = hypixelData.profiles[0];
        const profileData = profile.members[uuid];

        // Displaying the data in a structured way
        resultsDiv.innerHTML = `<h2>${username}'s SkyBlock Data</h2>`;

        const categories = {
            inventory: 'Inventory',
            wardrobe: 'Wardrobe',
            ender_chest: 'Ender Chest',
            pets: 'Pets',
        };

        for (const [key, title] of Object.entries(categories)) {
            if (profileData[key]) {
                const items = profileData[key];
                resultsDiv.innerHTML += `<h3>${title}</h3>`;
                const list = document.createElement('ul');
                items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = JSON.stringify(item);
                    list.appendChild(listItem);
                });
                resultsDiv.appendChild(list);
            }
        }
    } catch (error) {
        resultsDiv.innerHTML = `Error: ${error.message}`;
    }
}
