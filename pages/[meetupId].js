import React from "react";
import MeetupDetails from "@/components/meetups/MeetupDetails";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

const MeetupDetailsPage = (props) => {
  return (
    <>
      <Head>
        <title>{props.meetup.title}</title>
        <meta name="description" content={props.meetup.description} />
      </Head>
      <MeetupDetails
        image={props.meetup.image}
        title={props.meetup.title}
        description={props.meetup.description}
        address={props.meetup.address}
      />
    </>
  );
};

export default MeetupDetailsPage;

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(process.env.MONGODB_CONNECT);
  const meetupsCollection = client.db().collection("meetups");
  const meetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });
  client.close();

  return {
    props: {
      meetup: {
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        description: meetup.description,
        image: meetup.image,
      },
    },
  };
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.MONGODB_CONNECT);
  const meetupsCollection = client.db().collection("meetups");
  const meetups = await meetupsCollection
    .find(
      {},
      {
        projection: {
          _id: 1,
        },
      }
    )
    .toArray();
  client.close();

  return {
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
    fallback: "blocking",
  };
}
