import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../services/api";
import "../styles/components/detallePost.css";
import "../styles/components/home/postCards.css"
import MainLayout from "./layout/MainLayout";

type Tag = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  description: string;
  Tags: Tag[];
};

type Comment = {
  id: number;
  content: string;
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
        content: newComment,
        postId: Number(id),
        userId: 1,
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
  <MainLayout>
    <article className="post-card detalle-post-card">
      <h1 className="detalle-post-title">Detalle de publicación</h1>

      <p className="post-description">{post.description}</p>

      {post.Tags?.length > 0 && (
        <div className="post-tags">
          {post.Tags.map((tag) => (
            <span className="tag" key={tag.id}>#{tag.name}</span>
          ))}
        </div>
      )}

      {images.length > 0 ? (
        <div className="post-images">
          {images.map((image) => (
            <img
              className="post-img"
              key={image.id}
              src={image.url}
              alt="Imagen del post"
            />
          ))}
        </div>
      ) : (
        <p className="detalle-empty">Este post no tiene imágenes.</p>
      )}
    </article>

    <section className="post-card">
      <h2 className="detalle-post-title">Comentarios</h2>

      {comments.length > 0 ? (
        <div className="detalle-comments-list">
          {comments.map((comment) => (
            <article className="detalle-comment" key={comment.id}>
              <i className="bi bi-person-circle"></i>
              <p>{comment.content}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className="detalle-empty">No hay comentarios visibles.</p>
      )}

      <form className="detalle-comment-form" onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Escribí un comentario..."
        />

        {commentError && <p className="detalle-error">{commentError}</p>}

        <button type="submit">
          Comentar
          <i className="bi bi-send"></i>
        </button>
      </form>
    </section>
  </MainLayout>
)
}

export default DetallePost;