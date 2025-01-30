async function FetchDataWithImages(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
  
      // Update each item's image with fetched data URL
      return jsonData.map(async (item) => {
        const imageUrl = item.image;
        const imageResponse = await fetch(imageUrl);
        const blob = await imageResponse.blob();
        const imageDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
  
        return { ...item, image: imageDataUrl };
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      return []; // Return empty array in case of error
    }
}

export default FetchDataWithImages;