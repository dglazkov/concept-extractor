# Concept Miner

A silly experiment in concept extraction

To run yourself:

1. Clone the repo

2. Install the requirements

```bash
npm i
```

3. Create the `.env` file and add your API key to it:

```bash
OPENAI_API_KEY="<your API key here>"
```

4. Create a text file with your test passages. Keep it short. The miner runs out of context space fairly quickly.

5. Run the miner:

```bash
node . path/to/your/file.txt
```

6. The output will be in `path/to/your/file.txt.concepts.json`.
