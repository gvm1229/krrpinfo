import { redirect } from 'next/navigation';
// 이전 글 관리 주소 연결
const PostsPage = () => redirect('/admin/content/post');
export default PostsPage;
