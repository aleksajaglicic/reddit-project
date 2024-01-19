import React, { ReactNode, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
	children: ReactNode;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ children }) => {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return <>{children}</>;
};

export default ScrollToTop;

ScrollToTop.propTypes = {
	children: PropTypes.node.isRequired
};
