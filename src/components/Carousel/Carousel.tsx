import React, { useState, useEffect } from 'react';
import { CommentCard } from '../../components';
import styles from './Carousel.module.scss';
import type { Comment } from '../../data/comments.mock';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchComments } from '../../services/comment/commentService';

export type CarouselProps = {
  items?: React.ReactNode[];
  visibleCount?: number;
};

export const CarouselComponent: React.FC<CarouselProps> = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    fetchComments()
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

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: '0px',
            variableWidth: false,
          },
        },
      ],
    };

    return (
      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Comentários</h2>
        <div className={styles.sliderContainer}>
          <Slider {...settings}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.slideItem}>
                <CommentCard
                  name={comment.name}
                  description={comment.description}
                  rating={comment.rating}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  };

  return <>{renderCommentsCarousel()}</>;
};
