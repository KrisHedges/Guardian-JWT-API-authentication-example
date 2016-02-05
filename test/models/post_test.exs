defmodule KrishedgesSpace.PostTest do
  use KrishedgesSpace.ModelCase

  alias KrishedgesSpace.Post

  @valid_attrs %{body: "some content", published_at: "2010-04-17", slug: "some content", status: 42, title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Post.changeset(%Post{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Post.changeset(%Post{}, @invalid_attrs)
    refute changeset.valid?
  end
end
