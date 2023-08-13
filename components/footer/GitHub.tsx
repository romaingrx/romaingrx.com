type Event = {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
};

export default async function GitHub(): Promise<JSX.Element> {
  const events = await fetch('https://api.github.com/users/romaingrx/events', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: {
      revalidate: 1,
    },
  }).then((res) => res.json());
  return (
    <>
      <div className="flex h-[200vh] min-h-screen flex-col items-center justify-start">
        {events.map((event: Event) => (
          <div
            className="flex h-[200vh] min-h-screen flex-col items-center justify-start"
            key={event.id}
          >
            <h1>{event.type}</h1>
            <p>{event.repo.name}</p>
            <p>{event.created_at}</p>
          </div>
        ))}
      </div>
    </>
  );
}
