export default async function loadFile(accept: Record<string, string[]>) {
    const [fileHandle] = await window.showOpenFilePicker({
        types: [{ accept }],
    })
    return (await fileHandle.getFile()) as File
}
