const fs = require("fs");

const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

const imagePool = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
];

data.properties.forEach((property, index) => {
  const otherImages = imagePool.filter((url) => url !== property.image);

  property.images = [
    property.image,
    otherImages[index % otherImages.length],
    otherImages[(index + 1) % otherImages.length],
  ];
});

fs.copyFileSync("./db.json", "./db.backup.json");

fs.writeFileSync("./db.json", JSON.stringify(data, null, 2), "utf-8");
