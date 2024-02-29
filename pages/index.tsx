import * as IoIcons from "react-icons/io5";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import AppStore from "../components/Badges/AppStore";
import Button from "../components/Button";
import Featurette from "../components/Featurette";
import GooglePlay from "../components/Badges/GooglePlay";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import ContentBox from "../components/ContentBox";
import FeatureSection from "../components/FeatureSection";
import FullScreenSection from "../components/FullScreenSection";

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "home"])),
    },
  };
}

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <FullScreenSection>
        <ContentBox left={true} imageURL="/images/title.png" title="">
          <h1 className="font-bold mb-6">{t("home:title")}</h1>

          <p className="mb-6">{t("home:subtitle")}</p>
        </ContentBox>
      </FullScreenSection>
    </>
  );
}
