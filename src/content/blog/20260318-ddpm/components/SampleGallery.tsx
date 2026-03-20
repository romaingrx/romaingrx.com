import { ImageGrid } from '@/components/blog/components/image-grid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/react/card';

import run from '../run.json';

const images = run.samples.map((s) => ({ src: s.image, label: s.letter }));

export default function SampleGallery() {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>Generated glyphs</CardTitle>
        <CardDescription>12 class-conditional samples from the trained model</CardDescription>
      </CardHeader>
      <CardContent>
        <ImageGrid images={images} columns={6} size={64} />
      </CardContent>
    </Card>
  );
}
