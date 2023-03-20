import {Button, FormControl, Input, InputLabel, TextField} from "@mui/material";
import React, {useState} from "react";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import prisma from "@/prisma";
import WordsList from "@/components/WordsList";
import {createUseStyles} from "react-jss";
import {Prisma} from "@prisma/client";
import {useRouter} from "next/router";

interface Props {
  words: Prisma.WordSelect[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const words = await prisma.word.findMany();

  return {
    props: {words}
  }
}

export default function Home({words}: Props) {
  const router = useRouter()
  const classes = useStyles();

  const [newWordString, setNewWordString] = useState('');

  const handleInputChange = (event: any) => {
    setNewWordString(event.target.value)
  }

  const handleWordAdd = async () => {
    if (!newWordString) return;
    const body = {
      word: newWordString
    }
    await fetch('/api/words', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    router.reload();
  }

  return (
    <main>
      <TextField
        label="Добавить новое слово"
        variant="outlined"
        value={newWordString}
        fullWidth
        onChange={handleInputChange}
        InputLabelProps={{
          style: {
            color: 'white'
          }
        }}
        InputProps={{
          classes: {
            notchedOutline: classes.notchedOutline,
            input: classes.input
          }
        }}
      />
      <div style={{
        marginTop: 40
      }}>
        <Button
          variant="contained"
          color="primary"
          sx={{width: 200}}
          onClick={handleWordAdd}
          size="large"
        >
          ДОБАВИТЬ СЛОВО
        </Button>
      </div>
      <WordsList words={words} />
    </main>
  )
}

const useStyles = createUseStyles({
  input: {
    color: 'white !important'
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "white !important"
  }
});