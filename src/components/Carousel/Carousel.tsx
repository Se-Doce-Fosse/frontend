import React, { useState, useEffect } from 'react';
import { CommentCard } from '../../components';
import styles from './Carousel.module.scss';
import type { Comment } from '../../data/comments.mock';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchFeaturedComments } from '../../services/comment/commentService';

export type CarouselProps = {
  items?: React.ReactNode[];
  visibleCount?: number; // número de itens visíveis ao mesmo tempo
};

export const CarouselComponent: React.FC<CarouselProps> = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    // Carregar comentários
    fetchFeaturedComments()
      .then((data) => {
        if (!isSubscribed) {
          return;
        }

        setComments(data);
        setLoadingComments(false);
      })
      .catch(() => {
        if (!isSubscribed) {
          return;
        }

        setCommentsError('Erro ao carregar comentários');
        setLoadingComments(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const renderCommentsCarousel = () => {
    if (loadingComments) {
      return (
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comentários</h2>
          <div className={styles.loadingContainer}>
            <div>Carregando comentários...</div>
          </div>
        </div>
      );
    }

    if (commentsError) {
      return (
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comentários</h2>
          <div className={styles.errorContainer}>
            <div>{commentsError}</div>
          </div>
        </div>
      );
    }

    if (comments.length === 0) {
      return (
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comentários</h2>
          <div className={styles.noCommentsContainer}>
            <div>Nenhum comentário disponível no momento.</div>
          </div>
        </div>
      );
    }

    // Para desktop: agrupar comentários de 3 em 3
    const groupedCommentsDesktop = [];
    for (let i = 0; i < comments.length; i += 3) {
      groupedCommentsDesktop.push(comments.slice(i, i + 3));
    }

    return (
      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Comentários</h2>

        {/* Carousel para Desktop - 3 comentários por slide */}
        <Carousel
          className={`${styles.commentsCarousel} ${styles.desktopCarousel}`}
          interval={400000}
        >
          {groupedCommentsDesktop.map((group, index) => (
            <Carousel.Item key={`desktop-group-${index}`}>
              <div className={styles.carouselItemContentDesktop}>
                {group.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    name={comment.name}
                    description={comment.description}
                    rating={comment.rating}
                  />
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Carousel para Mobile - 1 comentário por slide */}
        <Carousel
          className={`${styles.commentsCarousel} ${styles.mobileCarousel}`}
          interval={400000}
        >
          {comments.map((comment) => (
            <Carousel.Item key={`mobile-${comment.id}`}>
              <div className={styles.carouselItemContentMobile}>
                <CommentCard
                  name={comment.name}
                  description={comment.description}
                  rating={comment.rating}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    );
  };

  return <>{renderCommentsCarousel()}</>;
};
