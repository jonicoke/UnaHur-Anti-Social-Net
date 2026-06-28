import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../services/api";

type Tag = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  description: string;
  tags: Tag[];
};

type Comment = {
  id: number;
  description: string;
};

type PostImage = {
  id: number;
  url: string;
};

function DetallePost() {
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [images, setImages] = useState<PostImage[]>([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    async function cargarDetallePost() {
      try {
        setLoading(true);

        const postResponse = await fetch(`${BASE_URL}/posts/${id}`);
        if (!postResponse.ok) {
          throw new Error("No se pudo cargar la publicación");
        }

        const commentsResponse = await fetch(`${BASE_URL}/comments/post/${id}`);
        if (!commentsResponse.ok) {
          throw new Error("No se pudieron cargar los comentarios");
        }

        const imagesResponse = await fetch(`${BASE_URL}/postimages/post/${id}`);
        if (!imagesResponse.ok) {
          throw new Error("No se pudieron cargar las imágenes");
        }

        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();
        const imagesData = await imagesResponse.json();

        setPost(postData);
        setComments(commentsData);
        setImages(imagesData);
      } catch (error) {
        setError("Ocurrió un error al cargar el detalle del post");
      } finally {
        setLoading(false);
      }
    }

    cargarDetallePost();
  }, [id]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (newComment.trim() === "") {
      setCommentError("El comentario es obligatorio");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: newComment,
          postId: Number(id),
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el comentario");
      }

      const createdComment = await response.json();

      setComments([...comments, createdComment]);
      setNewComment("");
      setCommentError("");
    } catch (error) {
      setCommentError("No se pudo agregar el comentario");
    }
  }

  if (loading) return <p>Cargando publicación...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>No se encontró la publicación.</p>;

  return (
    <main>
      <h1>Detalle de publicación</h1>

      <section>
        <p>{post.description}</p>

        <h2>Etiquetas</h2>
        {post.tags?.length > 0 ? (
          post.tags.map((tag) => <span key={tag.id}>#{tag.name} </span>)
        ) : (
          <p>Sin etiquetas.</p>
        )}

        <h2>Imágenes</h2>
        {images.length > 0 ? (
          images.map((image) => (
            <img key={image.id} src={image.url} alt="Imagen del post" />
          ))
        ) : (
          <p>Este post no tiene imágenes.</p>
        )}
      </section>

      <section>
        <h2>Comentarios</h2>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <article key={comment.id}>
              <p>{comment.description}</p>
            </article>
          ))
        ) : (
          <p>No hay comentarios visibles.</p>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Escribí un comentario..."
          />

          {commentError && <p>{commentError}</p>}

          <button type="submit">Comentar</button>
        </form>
      </section>
    </main>
  );
}

export default DetallePost;