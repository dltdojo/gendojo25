export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    return <div>
        <h1>Status: {params.slug}</h1><h1>message: {searchParams.msg}</h1>
    </div>
}