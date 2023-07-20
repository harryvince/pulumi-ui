<script>
    import { onMount } from "svelte";
    export let fileKey = "";

    let data;
    onMount(async function () {
        const response = await fetch("/api/state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: fileKey }),
        });
        const json = await response.json();
        data = JSON.parse(json.data);
    });
</script>

<article aria-busy={fileKey.trim() !== "" ? false : true}>
    <h3 aria-busy={(data) ? false : true}>{(data) ? `Version: ${data.version}` : ''}</h3>
    <table>
        <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Type</th>
                <th scope="col">Created</th>
                <th scope="col">Modified</th>
            </tr>
        </thead>
        <tbody>
            {#if data}
                {#each data.checkpoint.latest.resources as resource}
                    {#if resource.id && !resource.type.includes("providers")}
                        <tr>
                            <td>{resource.id}</td>
                            <td>{resource.type}</td>
                            <td>{resource.created}</td>
                            <td>{resource.modified}</td>
                        </tr>
                    {/if}
                {/each}
            {/if}
        </tbody>
    </table>
</article>

<style>
    article {
        text-align: center;
        margin: 0;
    }
</style>
