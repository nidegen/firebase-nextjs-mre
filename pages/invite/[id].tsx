import Head from "next/head";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import { useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import admin from "firebase-admin";
import Button from "../../components/Button";
import GooglePlay from "../../components/Badges/GooglePlay";
import AppStore from "../../components/Badges/AppStore";
import WebApp from "../../components/Badges/WebApp";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useLastViewedPhoto } from "../../utils/useLastViewedPhoto";
import { AlbumItem } from "../../utils/types";

interface PropsData {
  albumImagePreviewURL: string;
  albumName: string;
  albumItems: AlbumItem[];
  inviteId: string;
  domain: string;
}

interface Invite {
  id: string;
  group: string;
  timestamp: number;
  code?: string;
  disabled?: boolean;
  inviter?: string;
  groupName?: string;
  groupDescription?: string;
  groupImage?: string;
  members?: string[];
  photoCount?: number;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  locale,
}) => {
  if (admin.apps.length == 0) {
    admin.initializeApp();
  }
  const inviteId = params?.id as string;
  const host = req.headers.host;
  const projectId = admin.instanceId().app.options.projectId;

  let domain = `https://${projectId}.web.app`;
  if (host?.includes("localhost") || host?.includes("127.0.0.1")) {
    domain = "https://echo-photos-dev.web.app";
  }

  const reqURL = `${domain}/api/v1/invites/${inviteId}`;
  const itemsURL = `${domain}/api/v1/invites/${inviteId}/items`;

  try {
    const inviteResponse = await fetch(reqURL);
    const itemsResponse = await fetch(itemsURL);
    const invite: Invite = await inviteResponse.json();
    const items: AlbumItem[] = await itemsResponse.json();

    let propsData: PropsData = {
      albumName: invite.groupName ?? "",
      domain: domain,
      albumImagePreviewURL: `${domain}/api/v1/invites/${invite.id}/image`,
      albumItems: items
        .filter((item) => {
          return !item.video;
        })
        .sort((a, bg) => {
          if (a.contentTimeStamp < bg.contentTimeStamp) {
            return 1;
          } else if (a.contentTimeStamp < bg.contentTimeStamp) {
            return -1;
          }
          return 0;
        }),
      inviteId: inviteId,
      ...(await serverSideTranslations(locale ?? "en", ["common", "invite"])),
    };

    return {
      props: propsData,
    };
  } catch (e) {
    console.error(e);

    let propsData: PropsData = {
      albumName: "New Album Invite",
      domain: domain,
      albumImagePreviewURL: `${domain}/images/AppIcon300.png`,
      albumItems: [],
      inviteId: inviteId,
      ...(await serverSideTranslations(locale ?? "en", ["common", "invite"])),
    };

    return {
      props: propsData,
    };
  }
};

export default function InvitePage(props: PropsData) {
  const router = useRouter();
  const fullInviteId = router.query.id as string;
  const imageId = router.query.imageId as string | undefined;
  const inviteCode = fullInviteId.substring(0, 8);
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !imageId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [imageId, lastViewedPhoto, setLastViewedPhoto]);

  const { t } = useTranslation();

  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => setQrUrl(window.location.href), []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(inviteCode);
    alert(t("invite:copied"));
  };

  return (
    <>
      <Head>
        <title>
          {"Echo Photos - " + props.albumName ??
            t("invite:albumInvite") ??
            "Album Invite"}
        </title>

        <meta
          property="og:image"
          content={
            props.albumImagePreviewURL ??
            "https://www.echophotos.io/images/AppIcon300.png"
          }
        />
        <meta
          property="og:title"
          content={props.albumName ?? t("invite:albumInvite") ?? "Album Invite"}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Echo Photos" />
        <meta
          property="og:description"
          content={t("invite:social-preview.description") ?? "Join the album!"}
        />
      </Head>

      <section>
        <div className="container mx-auto max-w-6xl py-8 mt-16">
          <div id="inviteInfo" className="flex mb-20 md:flex-row flex-col">
            <div
              className="md:w-1/2 flex justify-center items-center px-5"
              id="qrcode"
            >
              <QRCode value={qrUrl} />
            </div>

            <div className="md:w-1/2 px-5 my-auto block text-center md:text-left">
              <h4 className="font-bold mb-4 md:mt-0 mt-16" id="title">
                {t("invite:title")}
              </h4>

              <p
                id="inviteCode"
                className="font-mono text-center py-2 px-5 md:mx-0 mx-auto bg-neutral-200 rounded-xl uppercase font-light text-5xl mb-2"
              >
                {inviteCode}
              </p>

              <p className="mb-6">{t("invite:description")}</p>

              <Button onClick={copyToClipboard} className="mx-0">
                {t("invite:copy-code")}
              </Button>
            </div>
          </div>

          <div className="flex md:flex-row flex-col text-center md:text-left">
            <div className="md:w-1/2 px-5 my-auto">
              <div className="block">
                <h1 className="font-bold mb-6" id="title">
                  {t("invite:download.title")}
                </h1>

                <p className="mb-6">{t("invite:download.description")}</p>

                <div className="flex justify-center md:justify-start items-center">
                  <AppStore />
                  <GooglePlay />
                  <WebApp inviteId="{fullInviteId}" />
                </div>
              </div>
            </div>

            <div className="md:w-1/2 px-5 flex items-center justify-center">
              <img src="/images/AppIcon300.png" alt="Echo Photos" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
