import React from "react";
import "./style.css";

function extractVideoId(url) {
  // Match the video ID from the URL using a regular expression
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|watch\?feature=share&v=))([^\?&"'>]+)/;

  // Execute the regular expression and get the first capturing group
  const match = url.match(regex);

  if (match && match?.[1]) {
    return match[1];
  } else {
    // Return null or handle the case when no match is found
    return null;
  }
}
function transformDriveLink(link) {
  // Regular expression to check for drive.google.com and replace /view with /preview
  const regex = /https?:\/\/drive.google.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;

  // Check if the link matches the regex
  const match = link.match(regex);

  if (match) {
    // If it matches, transform /view to /preview
    const fileId = match?.[1];
    const transformedLink = link.replace("/view", "/preview");
    return transformedLink;
  } else {
    // If it doesn't match, return null
    return null;
  }
}

const YouTubeEmbed = ({ embedUrl, customWidth, customHeight }) => {
  const videoId = extractVideoId(embedUrl);
  const transformedLink = transformDriveLink(embedUrl);
  return (
    <div className="video-responsive">
      <iframe
        width={customWidth ?? "367px"}
        height={customHeight ?? "206px"}
        src={
          transformedLink
            ? transformedLink
            : `https://www.youtube.com/embed/${videoId}`
        }
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
