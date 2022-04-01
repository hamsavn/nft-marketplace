import Slider from 'react-slick';
import styled from 'styled-components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { carouselNew } from './constants';
import { getFileUrl } from '@lib/get-file-url';
import { Nft } from '@generated/graphql';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

interface Props {
  items: Nft[];
}

export const CarouselNewRedux: React.FC<Props> = ({ items }) => {
  const router = useRouter();

  return (
    <div className="nft">
      <Slider {...(carouselNew as any)}>
        {items.map((nft, index) => (
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/nft/${nft.id}`);
            }}
            className="itm"
            key={nft.id}
          >
            <div className="d-item">
              <div className="d-item">
                <div className="nft__item">
                  <div className="author_list_pp">
                    <span>
                      <img
                        className="lazy"
                        src={getFileUrl(nft.creator.profileImage)}
                        alt=""
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/author/${nft.creator.address}`);
                        }}
                      />
                      <i className="fa fa-check"></i>
                    </span>
                  </div>

                  <div className="nft__item_wrap" style={{ height: 300, width: '100%' }}>
                    <Outer style={{ width: '100%' }}>
                      <span>
                        <Image
                          src={getFileUrl(nft.fileURL)}
                          width={300}
                          height={(nft.mediaHeight / nft.mediaWidth) * 300 || 300}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                      </span>
                    </Outer>
                  </div>

                  <div className="nft__item_info">
                    <span>
                      <h4>{nft.title}</h4>
                    </span>
                    <div className="nft__item_price">{nft.price} ETH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
