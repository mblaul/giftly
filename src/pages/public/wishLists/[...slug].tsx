import React from "react";
import { PublicTokenRouter } from "~/components/Token/PublicTokenRouter";
import { Layout } from "~/components/Layout";

export default function Public() {
  return (
    <>
      <Layout>
        <PublicTokenRouter />;
      </Layout>
    </>
  );
}
