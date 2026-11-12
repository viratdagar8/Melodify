export const GenreCard = ({ genre, onSelect }) => {
  if (!genre) return null;

  return (
    <div
      className="genre-card group"
      style={{ backgroundColor: genre.color || "#7c3aed" }}
      onClick={() => onSelect && onSelect(genre)}
    >
      <div className="genre-content">
        <h3 className="genre-title">{genre.name}</h3>
        <span className="genre-tag">Explore</span>
      </div>

      <div className="genre-art-wrapper">
        <img
          src={genre.image}
          alt={genre.name}
          className="genre-artwork"
          loading="lazy"
        />
      </div>
    </div>
  );
};
