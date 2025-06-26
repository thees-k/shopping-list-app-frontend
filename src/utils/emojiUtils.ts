// emojiUtils.ts

export function getRandomFunnyEmoji(): string {
    // A bigger list of emojis commonly considered “happy” or “funny”
    const emojis: string[] = [
        // Happy or smiling faces
        "😀", // Grinning Face
        "😃", // Grinning Face with Big Eyes
        "😄", // Grinning Face with Smiling Eyes / also used for tears of joy in some fonts
        "😁", // Beaming Face with Smiling Eyes
        "😆", // Grinning Squinting Face
        "😅", // Grinning Face with Sweat (some fonts)
        "😉", // Winking Face
        "😊", // Smiling Face with Smiling Eyes
        "😋", // Face Savoring Food

        // Additional “funny” or playful faces
        "😜", // Winking Face with Tongue
        "😝", // Squinting Face with Tongue
        "😸", // Grinning Cat Face with Smiling Eyes
        "😹", // Cat Face with Tears of Joy
        "🤣", // Rolling on the Floor Laughing
        "🤓", // Nerd Face
        "🤠", // Cowboy Hat Face
        "🤡", // Clown Face
        "🤪", // Zany Face
        "🥸", // Disguised Face
        "🥳", // Partying Face
        "🥴", // Woozy Face
        "🤯", // Exploding Head
        
        //
        "🤩",
        "🙃",
        "🐈",
        "🐁",
        "🐖",
        "🐞",
        "🐣",
        "🐱",
        "🌜",
        "🌞",
        "👸",
        "👶"
    ];

    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
}
