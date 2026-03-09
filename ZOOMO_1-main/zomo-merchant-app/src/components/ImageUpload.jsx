import { useRef } from "react";

export default function ImageUpload({ image, setImage }) {
  const fileInputRef = useRef();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setImage({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  const removeImage = () => {
    setImage(null);
    fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Dish Image
      </label>

      {image ? (
        <div className="relative w-40 h-40">
          <img
            src={image.preview}
            alt="Preview"
            className="w-full h-full object-cover rounded border"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="border border-dashed rounded w-40 h-40 flex items-center justify-center text-sm text-gray-500 hover:bg-gray-50"
        >
          Upload Image
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
