import { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext'
import '../../styles/components/home/feedCreate.css'

interface FeedCreateProps {
    onPostCreated: () => void
    fotoPerfil: string | null
}

export default function FeedCreate({ onPostCreated, fotoPerfil }: FeedCreateProps) {
    const { usuario } = useAuth()
    const userId = usuario?.id

    const [description, setDescription] = useState('')
    const [images, setImages] = useState<string[]>(['']) 
    const [tagsDisponibles, setTagsDisponibles] = useState<{ id: number; name: string }[]>([])
    const [selectedTags, setSelectedTags] = useState<number[]>([])
    const [estaExpandido, setEstaExpandido] = useState(false)

    useEffect(() => {
        fetch('http://localhost:3001/tags')
            .then((res) => res.json())
            .then((data) => setTagsDisponibles(data))
            .catch((err) => console.error('Error al cargar etiquetas:', err))
    }, [])

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images]
        newImages[index] = value
        setImages(newImages)
    }

    const agregarCampoImagen = () => setImages([...images, ''])
    
    const eliminarCampoImagen = (index: number) => {
        if (images.length > 1) {
            setImages(images.filter((_, i) => i !== index))
        }
    }

    const handleTagToggle = (tagId: number) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter((id) => id !== tagId))
        } else {
            setSelectedTags([...selectedTags, tagId])
        }
    }

    const handleSubmitPost = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!description.trim() || !userId) return

        try {
            const responsePost = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    description, 
                    userId, 
                    tagIds: selectedTags 
                }),
            })

            if (!responsePost.ok) throw new Error('Error al crear post')
            const nuevoPost = await responsePost.json()
            const postId = nuevoPost.id

            const urlsValidas = images.filter((url) => url.trim() !== '')
            if (urlsValidas.length > 0) {
                const promesasImagenes = urlsValidas.map((url) =>
                    fetch('http://localhost:3001/postimages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url, postId }),
                    })
                )
                await Promise.all(promesasImagenes)
            }

            alert('¡Publicación creada con éxito!')
            
            setDescription('')
            setImages([''])
            setSelectedTags([])
            setEstaExpandido(false)

            onPostCreated()

        } catch (error) {
            console.error(error)
            alert('No se pudo publicar la entrada')
        }
    }

    return (
        <>
    {/* Card pequeña */}
    <div className="feed-create">
        <div className="feed-create-header-row">

            <div className="feed-create-avatar-circle">
                {fotoPerfil ? (
                    <img src={fotoPerfil} alt={usuario?.nickName} className="profile-avatar-img" />
                ) : (
                    <i className="bi bi-person-circle"></i>
                )}
            </div>

            <button
                type="button"
                className="feed-create-btn"
                onClick={() => setEstaExpandido(true)}
            >
                ¿Qué estás pensando, {usuario?.nickName || "usuario"}?
            </button>

        </div>
    </div>

    {/* Modal */}
    {estaExpandido && (
        <div
            className="feed-modal-overlay"
            onClick={() => setEstaExpandido(false)}
        >
            <div
                className="feed-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmitPost}>

                    <div className="feed-modal-header">
                        <h2>Nueva publicación</h2>

                        <button
                            type="button"
                            className="feed-modal-close"
                            onClick={() => setEstaExpandido(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="feed-create-seccion">

                        <textarea
                            className="feed-textarea-expandida"
                            rows={5}
                            placeholder={`¿Qué estás pensando, ${usuario?.nickName || "usuario"}?`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            autoFocus
                            required
                        />

                    </div>

                    <div className="feed-create-seccion">
                        <label className="feed-create-titulo-seccion">
                            Imágenes (URLs)
                        </label>

                        {images.map((url, index) => (
                            <div key={index} className="feed-create-input-group">

                                <input
                                    type="text"
                                    className="feed-create-input-url"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={url}
                                    onChange={(e) =>
                                        handleImageChange(index, e.target.value)
                                    }
                                />

                                {images.length > 1 && (
                                    <button
                                        type="button"
                                        className="feed-create-btn-eliminar"
                                        onClick={() => eliminarCampoImagen(index)}
                                    >
                                        ✕
                                    </button>
                                )}

                            </div>
                        ))}

                        <button
                            type="button"
                            className="feed-create-btn-agregar"
                            onClick={agregarCampoImagen}
                        >
                            + Añadir otro enlace de imagen
                        </button>
                    </div>

                    <div className="feed-create-seccion">

                        <label className="feed-create-titulo-seccion">
                            Seleccionar Etiquetas
                        </label>

                        <div className="feed-create-tags-list">

                            {tagsDisponibles.map((tag) => {
                                const estaSeleccionado = selectedTags.includes(tag.id);

                                return (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        className={`feed-create-tag-chip ${estaSeleccionado ? "seleccionado" : ""}`}
                                        onClick={() => handleTagToggle(tag.id)}
                                    >
                                        #{tag.name}
                                    </button>
                                );
                            })}

                        </div>

                    </div>

                    <div className="feed-create-actions">

                        <button
                            type="button"
                            className="feed-create-btn-cancelar"
                            onClick={() => {
                                setEstaExpandido(false);
                                setDescription("");
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="feed-create-btn-publicar"
                            disabled={!description.trim()}
                        >
                            Publicar
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )}
</>
    )
}