import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { get } from "aws-amplify/api";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

const generateData = (authToken: string) => {
  const usersReq = get({
    apiName: "api",
    path: "/prod/fake-users",
    options: {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      queryParams: {
        count: "16",
      },
    },
  });
  return {
    users: usersReq.response.then((r) => r.body.json()) as unknown as Promise<
      User[]
    >,
    cancel: usersReq.cancel,
  };
};

const CONTAINERHEIGHT = 384,
  ROWHEIGHT = 48,
  OVERSCAN = 2;

export default function InfiniteLoad() {
  const user = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [allRows, setAllRows] = useState<User[]>([]);
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROWHEIGHT) - OVERSCAN);
  let renderedNodesCount =
    Math.floor(CONTAINERHEIGHT / ROWHEIGHT) + 2 * OVERSCAN;
  renderedNodesCount = Math.min(
    allRows.length - startIndex,
    renderedNodesCount
  );

  const rows = allRows.slice(startIndex, startIndex + renderedNodesCount);

  useEffect(() => {
    let cancel: any = () => {},
      usersRes: Promise<User[]>;
    (async function () {
      if (!user) return;
      setIsFetching(true);
      ({ users: usersRes, cancel } = generateData(user.authToken));
      const users = await usersRes;
      setAllRows((u) => u.concat(users));
      setIsFetching(false);
    })();

    return () => cancel();
  }, [user]);

  const onScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);

    if (
      target.scrollHeight - target.scrollTop - CONTAINERHEIGHT <= 200 &&
      user &&
      !isFetching
    ) {
      setIsFetching(true);
      const users = await generateData(user.authToken).users;
      setAllRows((u) => u.concat(users));
      setIsFetching(false);
    }
  };

  return (
    <main className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Users
            <em>
              Total Rows:{" "}
              <strong>
                {allRows.length}
                {isFetching && (
                  <Loader className="ml-1 animate-[spin_1.5s_linear_infinite] inline" />
                )}
              </strong>
            </em>
            <Link to="/">
              <Button variant="link">Go Back</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="grid grid-cols-[60px_60px_auto_auto]">
              <span>Id</span>
              <span>Avatar</span>
              <span>Name</span>
              <span>Email</span>
            </div>
            <div
              onScroll={onScroll}
              className="h-96 block overflow-y-scroll relative"
            >
              <div style={{ height: allRows.length * ROWHEIGHT }}>
                <div
                  style={{
                    transform: `translateY(${startIndex * ROWHEIGHT}px)`,
                  }}
                >
                  {rows.map((row) => (
                    <div
                      key={row.id}
                      className="border-b grid grid-cols-[60px_60px_150px_auto] items-center h-12"
                    >
                      <span title={row.id} className="ellipsis">
                        {row.id}
                      </span>
                      <img
                        className="ellipsis"
                        src={row.avatar}
                        alt="avatar"
                        width={40}
                        height={40}
                      />
                      <span title={row.name} className="ellipsis">
                        {row.name}
                      </span>
                      <span title={row.email} className="ellipsis">
                        {row.email}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
