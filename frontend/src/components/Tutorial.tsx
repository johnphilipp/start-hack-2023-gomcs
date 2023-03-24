import {NavLink, Paper, Text} from "@mantine/core";
import React from "react";
import Link from "next/link";

export const Tutorial: React.FC = () => {

    return (
        <Paper radius="md" shadow="md" p="lg" >
            <Text fz="xl" fw={700} mb={10}>
               How it works:
            </Text>
            <Text mb={10}>
                To get data from your google timeline you need to have it enabled and collect some data first.
            </Text>
            <ol className="list-disc pl-4 ml-4 text-gray-600">
                <li>After that go to  <a className="text-blue-500 hover:underline font-semibold rounded-lg" href={'https://www.google.com/maps/timeline'} target={"_blank"}>https://www.google.com/maps/timeline</a></li>
                <li>go to the gear icon</li>
                <li>select "download a copy of all your data"</li>
                <li>"Deselect all"</li>
                <li>Find "Location History" and select it</li>
                <li>scroll down and click "next step"</li>
                <li>hit "create export"</li>
                <li>you will get an email shortly after with a download link</li>
                <li>download the file from the link and upload it directly to <a className="text-blue-500 hover:underline font-semibold rounded-lg" href={'https://greenpath.withboom.com'} target={"_blank"}>https://greenpath.withboom.com</a></li>
            </ol>
            <Text mt={20} mb={20} weight={700}>
                Only distance data is stored on our backend and will also be completely deleted after the event!
            </Text>
            <img src={'https://user-images.githubusercontent.com/19433560/227466149-bc0086c6-ab43-473e-bb5c-0de031cc09c8.png'} alt={'tutorial step 1'} width={600}/>
        </Paper>)
};
