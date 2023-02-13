import React from "react";
import MeetupList from "@/components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>Next Meetups</title>
        <meta name="description" content="List of meetups" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

export default HomePage;

export async function getStaticProps() {
  const client = await MongoClient.connect(process.env.MONGODB_CONNECT);
  const meetupsCollection = client.db().collection("meetups");
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}
