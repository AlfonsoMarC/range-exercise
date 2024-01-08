import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  try {
    return NextResponse.json({ min: 1, max: 100 }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: "There was an error fetching the range limits"
      },
      { status: 500 }
    );
  }
}
