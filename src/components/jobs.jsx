import React, { Component } from 'react'
import JobsTable from './jobsTable'
import { getJobs } from '../services/fakeJobService';
import Pagination from '../common/pagination'
import {paginate} from '../utils/paginate';
import FilterJobtyp from '../common/filterJobtyp';
import { jobtyp } from '../services/fakeJobtypService';
import {getJobtyp} from '../services/fakeJobtypService';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import SearchBar from '../common/searchBar';





class Jobs extends Component {
    state = { 
        jobs : [],
        jobtyp: [],
        pageSize : 4,
        searchQuery: "",
        selectedJobtyp: null,
        currentPage : 1, 
        sortColumn: {path:'title', order: 'asc'}
    
     };

     componentDidMount () {
         const jobtyp = [{ _id:"", name : 'Any Job' },...getJobtyp()]

         this.setState ({ jobs : getJobs(), jobtyp: jobtyp });
     }


     handleDelete=(job)=>{
        const jobs = this.state.jobs.filter(m => m._id !== job._id);
        this.setState({jobs})  
     };

     handleLike = job => {
         const jobs = [...this.state.jobs];
         const index = jobs.indexOf(job);
         jobs[index] = {...jobs[index] };
         jobs[index].liked = !jobs[index].liked;
         this.setState({jobs})
     };

     handlePageChange = page => {
         this.setState ({currentPage: page});
     };

     handleJobtypSel = jobtyp => {
         this.setState ({ selectedJobtyp: jobtyp, searchQuery: "", currentPage: 1 });
     };

     handleSearch = query => {
         this.setState ({searchQuery: query, selectedJobtyp: null, currentPage: 1 })
     }

     handleSort = sortColumn => {
         
        this.setState({ sortColumn });
     };


     getPageData =() => {
        const { pageSize, currentPage, sortColumn, searchQuery, selectedJobtyp, jobs : allJobs } = this.state;
        
        let filtered = allJobs
        
        if (searchQuery)
            filtered = allJobs.filter( m =>
            m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
            
        else if (selectedJobtyp && selectedJobtyp._id)
            filtered = allJobs.filter (m => m.jobtyp._id === selectedJobtyp._id);



        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);


        const jobs = paginate(sorted, currentPage, pageSize);

        return { totalCount: filtered.length, data: jobs };
     };

     
    render() { 

        const { pageSize, currentPage, sortColumn } = this.state;

        // const { length : count } = this.state.jobs;

        
        if (this.state.jobs.length === 0)
        return <p>There are no Job Vacancies</p>;

        const { totalCount, data: jobs } = this.getPageData();

        
        return ( 
            <div className = "row"> 

                <div className="col-3">
                    <FilterJobtyp 
                    items = {this.state.jobtyp} 
                    selectedItem= {this.state.selectedJobtyp}
                    onJobtypSel = {this.handleJobtypSel} 

                    />
                </div>
                

                <div className="col">

                    <Link
                        to ="jobs/new"
                        className = "btn btn-primary"
                        style = {{marginBottom: 20}} >
                            Add New Job
                        </Link>

                <p>Showing {totalCount} Job Vacancies </p>
                
                {/* <SearchBar value = {searchQuery} onChange = {this.handleSearch} /> */}
                
                <JobsTable
                jobs = {jobs}
                sortColumn={sortColumn}
                onLike = {this.handleLike}
                onDelete = {this.handleDelete}
                onSort = {this.handleSort}
                />

                {/* <table className="table">
                    <thead>
                        <tr>
                            <th>Centre</th>
                            <th>Job Type</th>
                            <th>Vacancies</th>
                            <th>Salary</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job =>( 
                        <tr key = {job._id}>
                            <td>{job.title}</td>
                            <td>{job.jobtyp.name}</td>
                            <td>{job.vacancies}</td>
                            <td>{job.salary}</td>
                            <td> <Like liked = {job.liked} onLike = {() => this.handleLike(job)}/> </td>
                            <td> <button onClick = {() => this.handleDelete(job)} 
                            className = "btn btn-danger btn-sm">Delete</button> </td>
                        </tr>
                        ))}
                    </tbody>
                </table> */}
                <Pagination
                 itemsCount = {totalCount} 
                 pageSize = {pageSize} 
                 onPageChange = {this.handlePageChange}
                 currentPage = {currentPage}
                 />

                </div>

            </div>
          );
    }
}
 
export default Jobs;