import { Home, LibraryBigIcon } from "lucide-react";
import Design from "../public/category/design.jpg";
import MarkeThing from "../public/category/markething.jpg";
import Programming from "../public/category/programming.jpg";
import { NavItem } from "./types";

export const NavItems: NavItem[] = [
	{
		title: "Dashboard",
		icon: Home,
		href: "/dashboard/book",
		color: "text-black",
	},
	{
		title: "List",
		icon: LibraryBigIcon,
		href: "/dashboard/book/list",
		color: "text-black",
	},
];

export const tags = [
	{
		id: 1,
		title: "React",
		icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.png",
	},
	{
		id: 2,
		title: "React",
		icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.png",
	},
	{
		id: 3,
		title: "React",
		icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.png",
	},
	{
		id: 4,
		title: "React",
		icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.png",
	},
	{
		id: 5,
		title: "React",
		icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.png",
	},
	{
		id: 6,
		title: "React",
		icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.png",
	},
	{
		id: 7,
		title: "React",
		icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/react-js-icon.png",
	},
];

export type Tags = typeof tags;

export const Category = [
	{
		title: "Programming",
		image: Programming,
		communityCount: 10,
	},
	{
		title: "Design",
		image: Design,
		communityCount: 3,
	},
	{
		title: "Markething",
		image: MarkeThing,
		communityCount: 1,
	},
	{
		title: "Markething",
		image: MarkeThing,
		communityCount: 1,
	},
	{
		title: "Markething",
		image: MarkeThing,
		communityCount: 1,
	},
	{
		title: "Markething",
		image: MarkeThing,
		communityCount: 1,
	},
];
