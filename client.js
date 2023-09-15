const imagesContainer = document.querySelector(".images");

window.addEventListener("load", fetchImages);

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("myFile", document.querySelector("#myFile").files[0]);
  console.log(formData);
  try {
    const response = await fetch("http://4.245.244.225/upload", {
      method: "POST",
      body: formData,
    });

    if (response.status === 200) {
      alert("File uploaded successfully!");
      fetchImages();
    } else {
      alert("File upload failed.");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
});

async function fetchImages() {
  try {
    const response = await fetch("http://4.245.244.225/images");
    const images = await response.json();
    console.log(images)
    let index = 0;
    images.forEach((image) => {
      const img = document.createElement("img");
      img.src = `${images[index]}`;
      imagesContainer.appendChild(img);
      index++;
    });
  } catch {
    console.error("Error fetching images");
  }
}
