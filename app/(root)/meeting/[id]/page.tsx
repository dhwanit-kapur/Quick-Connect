export default async function MeetingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div>
      <p>Meeting id: #{id}</p>
    </div>
  );
}
