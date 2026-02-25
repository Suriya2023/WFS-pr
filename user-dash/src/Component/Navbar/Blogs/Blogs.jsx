import React from 'react'
import PressHighlights from '../../Home/Highlights/PressHighlights'
import ExporterReads from './ExporterReads'
import NewBlogpost from './NewBlogpost'
import ExportCatalogue from './ExportCatalogue'
import BlogTwoColumn from './BlogTwoColumn'

function Blogs() {
  return (
    <div>
      <ExporterReads />
      <NewBlogpost />
      <ExportCatalogue />
      <BlogTwoColumn />
      {/* <PressHighlights /> */}
    </div>
  )
}

export default Blogs
