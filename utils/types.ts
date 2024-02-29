/* eslint-disable no-unused-vars */
export interface SharedModalProps {
  index: number;
  domain: string;
  inviteId: string;
  albumItems: AlbumItem[];
  currentPhoto?: string;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  direction?: number;
}


export interface AlbumItem {
  image: string;
  video?: boolean;
  contentTimeStamp: number;
}
